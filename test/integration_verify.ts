//client a
//client b
//client b should receive a "user online" message for client a
//client a disconnects
//client b should receive a "user offline" message for client a

import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

async function runTest(){
    console.log("Start integration verification");
    const response = await fetch("http://localhost:3000/api/test/pair");
    const { subjectId, observerId } = await response.json();
    console.log(`Starting test with discovered IDs: A=${subjectId}, B=${observerId}`);
    //client b setup (observer)
    const clientB = io(SERVER_URL,{auth: {userId:observerId}});

    clientB.on("connect", () => {
        console.log("Client B connected (Socket: " + clientB.id + ")");
        //client a setup
        setTimeout(() => {
            const clientA = io(SERVER_URL,{auth: {userId:subjectId}});
            clientA.on("connect", () => {
                console.log("Client A connected. Notifications should trigger now.");
            });
            //execution
            setTimeout(() => {
                console.log("Disconnecting client a to test clean up");
                clientA.disconnect();
            }, 3000);
        },2000);
    });


    let onlineReceived = false;
    let offlineReceived = false;

    clientB.on("user_online",(data) => {
        console.log("DEBUG: Client B heard 'user_online' event with data:", data);
        if(data.id == subjectId){
            console.log("Client B received user_online for Client A:", data);
            onlineReceived = true;
        }
    });

    clientB.on("user_offline",(data) => {
        console.log("DEBUG: Client B heard 'user_offline' event with data:", data);
        if(data.id == subjectId){
            console.log("Client B received user_offline for Client A:", data);
            offlineReceived = true;
        }
    });

    //report
    setTimeout(() => {
        console.log("\n--- Final Report ---");
        if(onlineReceived && offlineReceived){
            console.log("Test passed : connection and disconnection logic is fully functional.");
        }else {
            console.log("Test failed : missing notifications - onlineReceived:", onlineReceived, "offlineReceived:", offlineReceived);
        }
        process.exit(0);
    }, 6000);
}

runTest();