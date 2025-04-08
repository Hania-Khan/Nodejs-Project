pipeline {
    agent{
       docker { image 'node:16-alpine'}
}
    stage {
        stage ('Test'){
            steps {
                sh 'node --version'
            }
        }
    }
}
