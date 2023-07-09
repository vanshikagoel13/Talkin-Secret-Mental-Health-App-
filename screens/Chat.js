import React, {	useState, useEffect, useLayoutEffect, useCallback} from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy,	query, onSnapshot, where, or, and, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
  
export default function Chat({route}) {
  
	const [messages, setMessages] = useState([]);
	const navigation = useNavigation();
  
	const onSignOut = () => {

		signOut(auth).catch(error => console.log('Error logging out: ', error));
	};
  
	useLayoutEffect(() => {
		navigation.setOptions({
		  headerRight: () => (
			<TouchableOpacity
			  style={{
				marginRight: 10
			  }}
			  onPress={onSignOut}
			>
			  <AntDesign name="logout" size={24} color={colors.lightGray} style={{marginRight: 10}}/>
			</TouchableOpacity>
		  )
		});
	  }, [navigation]);
  
	useLayoutEffect(() => {
	  	
		const collectionRef = collection(db, 'chats');
	  	const q = query(collectionRef, orderBy('createdAt', 'desc'), 
			or(and(where('sender','==',auth?.currentUser?.email), where('receiver','==', route.params.toUser)), 
			and(where('sender','==',route.params.toUser), where('receiver','==',auth?.currentUser?.email)))
		);
  
		const unsubscribe = onSnapshot(q, querySnapshot => {

			console.log('querySnapshot unsusbscribe');
			console.log(route.params.toUser);

			setMessages(
				querySnapshot.docs.map(doc => ({
					_id: doc.data()._id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user,
					receiver: doc.data().receiver,
					sender: doc.data().sender,
					recname: doc.data().recname,
					senderName: doc.data().senderName
				}))
			);
		});
		return unsubscribe;
	}, [route.params.toUser]);
  
	var sendername;

	const onSend = useCallback(async (messages = []) => {
  
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages)
		);

		const recname = route.params.receiverName;
		const receiver = route.params.toUser;
		const sender = auth?.currentUser?.email;
		const { _id, createdAt, text, user } = messages[0];
		
		const getSenderName = async () => {

		const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", sender)));

			if (querySnapshot && !querySnapshot.empty) {
				querySnapshot.forEach((doc) => {
					const {username} = doc.data();
					sendername = username;
				});
			}
			else {
				console.log('error in querSnapshot');		  
			}
		};

		await getSenderName();
		const senderName = sendername;
	  
		addDoc(collection(db, 'chats'), {
			_id,
			createdAt,
			text,
			user,
			receiver,
			sender,
			recname,
			senderName
		});
	}, [route.params.toUser]);

	const renderBubble = (props) => {

		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#f506f9',
						borderRadius: 10,
					},
					left: {
						borderRadius: 10,
					},
				}}
				textStyle={{

					right: {
						color: 'white',
					},
				}}
			/>
		);
	};

	function renderInputToolbar(props) {
		return (
			<InputToolbar
			{...props}
			containerStyle={{
			  	backgroundColor: '#141714',
			}}
		  	/>
		);
	}

	const backImage = require("../assets/wp.jpg");
	const image = require("../assets/persongrey.jpg")


	return (

		<ImageBackground source = {backImage} style = {styles.backImage} >
			<View style = {{height: 55}}>
				<View style = {styles.list}>
					<Image 
					source = {image}
					style = {styles.imageCard}/>
					<View style = {{margin: 5}}>
						<Text style = {styles.heading}>{route.params.receiverName}</Text>
					</View>
				</View>
			</View>
			<View style = {{flex: 1}}>
				<GiftedChat
				messages={messages}
				showAvatarForEveryMessage={false}
				showUserAvatar={false}
				onSend={messages => onSend(messages)}
				renderBubble={renderBubble}
				textInputStyle={{
					backgroundColor: '#141714',
					borderRadius: 10,
					color: '#fff'
				}}
				user={{
					_id: auth?.currentUser?.email,
					avatar: 'https://play-lh.googleusercontent.com/_qUtBpMVsGY-CLPx2DreAENHAbr4KHwBGn2w_3jhGSzoRVFRKn0SXUaK0wXSU0SJ7A=w240-h480-rw'
				}}
				renderInputToolbar={renderInputToolbar}
				/>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({

	heading: {

		fontSize: 24,
		paddingLeft: 2,
		color: "#f7bfb4",
		fontFamily: "AlegreyaRegular",
	},
	
	imageCard: {

		height: 50,
		width: 50,
		borderRadius: 25,
	},

	list: {

		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#141714',
		alignItems: 'center',
		paddingLeft: 10
	},

	backImage: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
	},
})