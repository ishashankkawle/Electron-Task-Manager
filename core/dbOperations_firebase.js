let firebase = require('firebase/app');
require('firebase/database');

module.exports = class dbOperations {
    initialize(config) {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        //firebase.initializeApp(config);
        return firebase.database();
    }

    insertData(jsonData, category, firebaseDb) {
        let dbRef = firebaseDb.ref().child(category);
        dbRef.push(jsonData);
    }

    readAllData(category, firebaseDb) {
        let data = [];
        let dbRef = firebaseDb.ref(category);
        console.log(dbRef);
        dbRef.on("value", function (snapshot) {
            snapshot.forEach(function (child) {
                data.push(child.val());
            });
        })
        return data;
    }
}