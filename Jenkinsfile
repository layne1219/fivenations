pipeline {
	agent any
    stages {
		stage('Sanity check') {
		    agent { docker 'node:7-alpine' }
		    steps {
		    	sh 'sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}'
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
