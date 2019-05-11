#!groovy
node {
    stage('Build') {
        echo 'Cloning repository...'
        checkout scm
        echo 'Building...'
        nodejs('nodejs') {
            withCredentials([string(credentialsId: 'APIKEY_FIREBASE_SUM_APP_LIVE', variable: 'FIREBASE_API_KEY')]) {
				sh "npm install"
				sh "npm run updateBuild -- $FIREBASE_API_KEY"
				sh "ng build"
            }
        }
    }
    stage('Deploy') {
        echo 'Preparing Firebase descriptors...'
        sh 'cp -f firebase/firebase.json firebase/.firebaserc dist/'
        echo 'Deploying...'
        nodejs('nodejs') {
            withCredentials([string(credentialsId: 'TOKEN_FIREBASE_SUM_APP_LIVE', variable: 'FIREBASE_TOKEN')]) {
                dir('dist') {
                    sh 'firebase deploy'
                }
            }
        }
    }
}