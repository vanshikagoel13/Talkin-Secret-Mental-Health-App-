import { TouchableOpacity, Image, ScrollView, StyleSheet, Text,	View } from "react-native";
import React from "react";

  
const customFonts = {
	AlegreyaRegular: require("../assets/Alegreya-Bold.ttf"),
	OpenSans: require("../assets/OpenSans-Bold.ttf"),
};
  
export default function Student_C({ route, navigation }) {

	const image = require('../assets/persongrey.jpg')

	return (

	  	<View style={{ flex: 1, backgroundColor: "#000" }}>
		<View style={{ flex: 1, marginTop: 15, backgroundColor: "#000" }}>
		<View style={{ flex: 1, backgroundColor: "#000" }}>
			<Text style={styles.heading1}>Students List</Text>
			<View style={{ marginTop: 25 }} />
			<ScrollView style = {styles.container}>
				{route.params.myStudentList && route.params.myStudentList.map(({ email, username }) => email && username ? (
					<TouchableOpacity onPress={() => navigation.navigate("Chat_C", { toUser: email, receiverName: username })} key = {email}>
						<View style = {styles.list}>
							<Image 
							source = {image}
							style = {styles.imageCard}/>
							<View style = {{margin: 5}}>
								<Text style = {styles.heading}>{username}</Text>
							</View>
						</View>
					</TouchableOpacity>
					) : (
						console.log("failed to create student list")
					)
				)}
			</ScrollView>
		  </View>
		</View>
	  </View>
	);
}

const styles = StyleSheet.create({

	heading1: {

		textAlign: "center",
		fontSize: 38,
		color: "#f7bfb4",
		fontFamily: "AlegreyaRegular",
	},

	heading: {

		fontSize: 24,
		paddingLeft: 2,
		color: "#f7bfb4",
		fontFamily: "AlegreyaRegular",
	},
  
	container: {

		flex: 1,
		backgroundColor: "#000",
		margin: 8,
		borderRadius: 16,
		marginBottom: 20
	},
  
	Text: {

		flex: 1,
		flexGrow: 1,
		width: 180,
		margin: 10,
		paddingLeft: 6,
	},
  
	list: {

		flex: 1,
		flexDirection: 'row',
		height: 100,
		alignItems: 'center',
		paddingLeft: 10,
		margin: 8,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#fff",
		backgroundColor: "#141714",
	},
  
	pfp: {

		width: 140,
		height: 200,
		borderRadius: 8,
		borderColor: "black",
	},
  
	imageCard: {

		height: 50,
		width: 50,
		borderRadius: 30,
    },
  });