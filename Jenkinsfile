pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
  }

  triggers {
    pollSCM('H/2 * * * *')
  }

  environment {
    IMAGE = 'proyecto-web'
    CONTAINER = 'proyecto-web-prod'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t ${IMAGE}:${BUILD_NUMBER} -t ${IMAGE}:latest .'
      }
    }

    stage('Test') {
      steps {
        sh '''
          docker run --rm ${IMAGE}:${BUILD_NUMBER} nginx -t
          docker rm -f test-${BUILD_NUMBER} || true
          docker run -d --name test-${BUILD_NUMBER} ${IMAGE}:${BUILD_NUMBER}
          sleep 3
          docker exec test-${BUILD_NUMBER} wget -qO- http://127.0.0.1:8080/ | grep -q "Sitio en contenedor"
        '''
      }
      post {
        always {
          sh 'docker rm -f test-${BUILD_NUMBER} || true'
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker rm -f ${CONTAINER} || true
          docker run -d --name ${CONTAINER} --restart unless-stopped -p 8080:8080 ${IMAGE}:${BUILD_NUMBER}
        '''
      }
    }
  }
}
