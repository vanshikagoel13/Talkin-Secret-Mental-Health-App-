import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { auth, db } from '../config/firebase';

export default function Menu({navigation}) {

	const options = [

		{
			uid: "1",
			name: 'Home',
			image: require('../assets/home.jpg'),
			page: 'Home_C'
		},
		{
			uid: "2",
			name: 'Chat with Students',
			image: require('../assets/chat.jpg'),
			page: 'Students_C'
		},
		{
			uid: "3",
			name: 'Log Out',
			image: require('../assets/logout.jpg'),
			page: 'Logout_C'
		}
	];

	const studentList = [];

	const func = (uid, page) => {

		if (uid === "2") {

			onHandle();
		}
		else {

			navigation.navigate(page);
		}
	}

    const onHandle = async () => {

		await onShowList(studentList);
		console.log(studentList);
		navigation.navigate("Students_C", {myStudentList: studentList});
    }

    const onShowList = async (studentList) => {
	
		const querySnapshot = await getDocs(query(collection(db, "chats"), where("receiver", "==", auth?.currentUser?.email)));
	
		if (querySnapshot && !querySnapshot.empty) {
			querySnapshot.forEach((doc) => {
                var {sender, senderName} = doc.data();
                var x = {email: sender, username: senderName};
                if (!studentList.some(e => e.email == x.email)) {
                    console.log(x);
                    studentList.push(x);
                }
			});
		} else {
			console.log("No documents found");
		}
        console.log(studentList);
	};

	return (
		
		<View style = {{flex: 1, backgroundColor:'#000'}}>
			<View style = {{flexDirection: 'row', marginTop:20}}>
				<Text style = {styles.headingText}>MENU</Text>
			</View>
			<View style = {{marginTop: 30}}></View>
			<ScrollView style = {styles.container}>
				{options.map(({uid, name, image, page}) => (
					<TouchableOpacity onPress = {() => func(uid, page)}>
						<View key = {uid} style = {styles.list}>
							<Image 
							source = {image}
							style = {styles.imageCard}/>
							<View style = {styles.Text}>
								<Text style = {{fontSize: 20, color: '#fff'}}>{name}</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({

	headingText: {

		flex: 1,
		textAlign: 'center',
		fontSize: 30,
		fontFamily: 'AlegreyaRegular',
		color: '#f7bfb4'
	},

	container: {

		flex: 1,
		height: 400,
		backgroundColor: '#000',
		margin: 8,
		borderRadius: 8
	},

	menuBody: {

		flex: 1, 
		margin: 10
	},

	list: {

		flex: 1,
		flexDirection: 'row',
		alignContent: 'center',
		margin: 8,
		borderRadius: 8,
		borderColor: '#fff',
		borderWidth: 1
	},

	imageCard: {

		height: 60,
		width: 60,
		borderRadius: 30,
		margin: 8
	},

	Text: {

		justifyContent: 'center',
		margin: 5
	},
})