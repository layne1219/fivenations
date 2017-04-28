pipeline {
    environment {
        build = 'fivenations:build_${env.BUILD_ID}'
        port = '9000'
    }
	agent any
    stages {
        stage('Build docker image') {
            steps {
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"            
                sh "docker build -t ${build} ."
            }
        }
        stage('Stop currently running container') {
            steps {
                sh "docker rm -f $(docker ps | grep ${port} | awk '{print $1}')"
            }
        }        
        stage('Deploy docker image') {
            steps {
                sh "docker run -d -p ${port}:${port} -it ${build}"
            }
        }
    }
}
