pipeline {
	agent any
    stages {
		stage('Sanity check') {
		    agent { docker 'node:7-alpine' }
		    steps {
		    	sh 'mkdir ~/.npm-global'
		    	sh 'npm config set prefix "~/.npm-global"'
		    	sh 'export PATH=~/.npm-global/bin:$PATH'
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
