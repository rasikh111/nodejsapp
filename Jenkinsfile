pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'my-node-app:latest'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: '71aba763-68ee-4816-a3da-8f8e77aeaebf', url: 'https://github.com/rasikh111/nodejsapp.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint & Test') {
            steps {
                sh 'npm run lint'
                sh 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: '175ceee5-5396-4ccd-99ac-0df2300761ce', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login $DOCKER_REGISTRY --username $DOCKER_USER --password-stdin
                        docker tag $DOCKER_IMAGE $DOCKER_USER/$DOCKER_IMAGE
                        docker push $DOCKER_USER/$DOCKER_IMAGE
                    '''
                }
            }
        }
        stage('Deploy to Docker') {
            steps {
                sh 'docker stop node-app || true && docker rm node-app || true'
                sh 'docker run -d -p 3000:3000 --name node-app $DOCKER_IMAGE'
            }
        }
    }
}
