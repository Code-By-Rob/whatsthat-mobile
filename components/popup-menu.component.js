import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    Menu,
    MenuOptions,
    MenuProvider,
    MenuTrigger,
} from "react-native-popup-menu";

const Divider = () => <View style={styles.divider} />;
const CustomMenu = () => {
 return (
   <MenuProvider style={styles.container}>
     <Menu>
       <MenuTrigger
         customStyles={{
         }}
       >
         <Entypo name="dots-three-vertical" size={24} color="black" />
       </MenuTrigger>
       <MenuOptions
         customStyles={{
            optionsWrapper: {
                backgroundColor: '#00000010',
                position: 'absolute',
                height: 240,
                width: 180,
                top: -30,
                right: 0,
                zIndex: 10
            },
           optionsContainer: {
             borderRadius: 10,
           },
         }}
       >
         <Text>Item 1</Text>
         <Divider />
         <Text>Item 2</Text>
         <Divider />
         <Text>Item 3</Text>
         <Divider />
         <Text>Item 4</Text>
         <Divider />
         <Text>Item 5</Text>
         <Divider />
         <Text>Item 6</Text>
       </MenuOptions>
     </Menu>
   </MenuProvider>
 );
};

export default CustomMenu;

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#fff",
   position: 'relative',
 },
 divider: {
   height: StyleSheet.hairlineWidth,
   backgroundColor: "#7F8487",
 },
});