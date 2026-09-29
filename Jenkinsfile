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
    TRIVY = 'aquasec/trivy:0.72.0'
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

    stage('Security Scan') {
      steps {
        sh '''
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v trivy-cache:/root/.cache/ \
            ${TRIVY} image \
            --severity CRITICAL --ignore-unfixed --exit-code 1 \
            ${IMAGE}:${BUILD_NUMBER}
        '''
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
          docker network create web-net || true
          docker rm -f ${CONTAINER} || true
          docker run -d --name ${CONTAINER} \
            --network web-net \
            --restart unless-stopped \
            --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 \
            --read-only --tmpfs /tmp \
            --cap-drop ALL \
            --security-opt no-new-privileges:true \
            --memory 128m --cpus 0.5 --pids-limit 100 \
            -p 8080:8080 ${IMAGE}:${BUILD_NUMBER}
        '''
      }
    }
  }
}
