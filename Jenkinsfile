pipeline {
    agent { docker 'node:6.3' }
    stages {
    	stage('install dependencies') {
    		steps {
    			sh 'npm install'
    		}
    	}
        stage('build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
