pipeline {
	agent any
    stages {
        stage('build docker image') {
            steps {
                sh 'docker build -t fivenations:master'
            }
        }
    }
}
