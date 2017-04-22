pipeline {
    agent { docker 'node:7-alpine' }
    stages {
    	stage('install dependencies') {
    		steps {
    			sh 'npm install'
    		}
    	}
        stage('sanity check') {
            steps {
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
