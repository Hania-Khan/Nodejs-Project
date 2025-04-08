pipeline {
    agent {
        docker {
            image 'node:16-alpine'
        }
    }
    stages {
        stage('Info') {
            steps {
                echo 'Basic Jenkins pipeline setup complete!'
                sh 'ls -al'
            }
        }
    }
}
