pipeline {
	agent any
    stages {
		stage('Sanity check') {
		    agent { docker 'node:7-alpine' }
		    steps {
		        sh 'npm install'
		        sh 'npm run test' 
		    }
	    }
        stage('build docker image') {
            steps {            
                sh 'docker build -t fivenations:master'
            }
        }
    }
}
