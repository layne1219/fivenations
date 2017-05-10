pipeline {
    environment {
        DOCKER_IMAGE = "fivenations:${env.BRANCH_NAME}_${env.BUILD_ID}"
        FV_PORT = '9000'
    }
	agent any
    stages {
        stage('Build docker image') {
            steps {
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"            
                sh "docker build --no-cache -t ${env.DOCKER_IMAGE} ."
            }
        }
        stage('Stop currently running container') {
            steps {
                sh "docker rm -f \$(docker ps | grep ${env.FV_PORT} | awk '{print \$1}') && echo 'container removed' || echo 'container does not exist'"
            }
        }        
        stage('Deploy docker image') {
            steps {
                sh "docker run -d -p ${env.FV_PORT}:${env.FV_PORT} -it ${docker_image}"
            }
        }
    }
}
