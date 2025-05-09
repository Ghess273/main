import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

// temp obj for testing
// export const firebaseDataDoc = {
//     displayName: "johnny123",
//     inviteInbox: [
//         {
//             fromUser: "jane_abc",
//             message: "Join the planning session!",
//             event: {
//                 name: "Planning Session",
//                 date: "2025-04-27",
//                 time: { startTime: "14:00", endTime: "15:00" },
//                 type: "group",
//                 group: []
//             }
//         }
//     ],
//     taskList: [
//         { name: "Submit report", status: false, date: "2025-04-26" }
//     ],
//     weeklyGoal: "complete 3 tasks by the end of the week",
//     preferredTimes: [],
//     userAvailability: [
//         { "day": 0, "startTime": "09:00", "endTime": "12:00" },
//         { "day": 2, "startTime": "14:00", "endTime": "17:00" }
//     ],
//     userCalendar: [
//         {
//             name: "Team Check-in",
//             date: "2025-04-30",
//             time: { startTime: "10:00", endTime: "10:30" },
//             group: []
//         },
//         {
//             name: "Team Check-in",
//             date: "2025-05-02",
//             time: { startTime: "10:00", endTime: "10:30" },
//             group: [],
//             type: 'productive'
//         },
//         {
//             name: "Team Check-in",
//             date: "2025-05-2",
//             time: { startTime: "14:00", endTime: "16:30" },
//             group: [],
//             type: 'social'
//         },
//         {
//             name: "Team Check-in",
//             date: "2025-05-2",
//             time: { startTime: "1:00", endTime: "1:30" },
//             group: [],
//             type: 'personal'
//         }
//     ]
// };

export async function persistUserData(uid: string, updatedUser: any) {
    try {
        // Send a POST request to your backend controller's save endpoint
        const response = await fetch(`http://192.168.1.101:5000/api/user/save?uid=${uid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser), // Send the data to the backend
        });

        const result = await response.json();
        console.log('Response:', result);
        if (response.ok) {
            console.log("Data successfully saved:", result);
        } else {
            console.error("Failed to save data:", result);
        }
    } catch (error) {
        console.error("Error while saving data:", error);
    }
}

export async function saveDataToSessionStorage(firebaseDataDoc: any) {
    const user = {
        displayName: firebaseDataDoc.displayName,
        invites: firebaseDataDoc.inviteInbox,
        tasks: firebaseDataDoc.taskList,
        weeklyGoal: firebaseDataDoc.weeklyGoal
    };

    const calendar = {
        availability: firebaseDataDoc.userAvailability,
        preferredTimes: firebaseDataDoc.preferredTimes,
        events: firebaseDataDoc.userCalendar
    };

    try {
        const userJson = JSON.stringify(user);
        await AsyncStorage.setItem("user", userJson);

        const calJson = JSON.stringify(calendar);
        await AsyncStorage.setItem("calendar", calJson);

        console.log("user", userJson);
        console.log("calendar", calJson);
    } catch (e) {
        console.error("Saving error:", e);
    }
};

export async function getUserByUID(uid: string) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userInfoDocRef = doc(userDocRef, 'userinfo', 'primary');
        const userInfoDoc = await getDoc(userInfoDocRef);

        if (!userInfoDoc.exists()) {
            console.log('No primary userinfo found for UID:', uid);
            return null;
        }

        return userInfoDoc.data();
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}
