pipeline {
    agent { docker 'node:7-alpine' }
    stages {
        stage('build docker image') {
            steps {
                sh 'docker build -t fivenations:master'
            }
        }
    }
}
