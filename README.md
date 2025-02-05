# Node.js Application CI/CD Pipeline with Jenkins and Docker

This project demonstrates the setup of a complete CI/CD pipeline for a Node.js application using Jenkins and Docker. Below is a detailed step-by-step guide outlining the process.

## Prerequisites

Ensure the following are installed and configured:

- **AWS EC2 Instance** running Ubuntu 20.04 or later
- **Node.js** (v18.19.1 or later)
- **Docker** (latest version)
- **Jenkins** (latest stable release)
- **GitHub Repository** containing the Node.js application
- **Jenkins Pipeline Plugin**

---

## Project Setup Steps

### 1. Install Node.js

```bash
sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm
```

Verify the installation:

```bash
node -v
npm -v
```

### 2. Install and Configure Docker

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

Verify the installation:

```bash
docker --version
```

### 3. Install Jenkins

```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
```

Add the Jenkins repository:

```bash
echo "deb http://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt update
sudo apt install -y jenkins
```

Start Jenkins:

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

Access Jenkins via `http://<EC2_INSTANCE_PUBLIC_IP>:8080`.

### 4. Unlock Jenkins and Install Plugins

- Access Jenkins and unlock it using the initial admin password located at `/var/lib/jenkins/secrets/initialAdminPassword`.
- Install recommended plugins during the setup.

### 5. Configure Jenkins Credentials

- Go to **Manage Jenkins > Credentials > System > Global credentials (unrestricted)**.
- Add the following credentials:
  - **GitHub credentials:** to access your repository.
  - **Docker Hub credentials:** for pushing the Docker image.

### 6. Configure GitHub Repository

Ensure your Node.js project has the following structure:
```
nodejsapp/
├── app.js
├── package.json
├── package-lock.json
└── Dockerfile
```

### 7. Write the Jenkins Pipeline

Below is the `Jenkinsfile` used:

```groovy
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
```

### 8. Commit and Push to GitHub

```bash
git add .
git commit -m "Initial commit with Jenkins pipeline configuration"
git push origin main
```

### 9. Configure Jenkins Job

1. Go to Jenkins Dashboard and create a **Pipeline Project**.
2. Configure the following:
   - **Git Repository:** Set your GitHub URL.
   - **Credentials:** Select the GitHub credentials.
   - **Pipeline Definition:** Choose Pipeline script from SCM.
   - **Script Path:** Set as `Jenkinsfile`.
3. Save and run the build.

### 10. Verify Pipeline Execution

- Ensure each stage (Clone Repository, Install Dependencies, Build Docker Image, Push Docker Image, Deploy to Docker) is successfully executed.

### 11. Test Application Deployment

Access the deployed application by navigating to:

```
http://<EC2_INSTANCE_PUBLIC_IP>:3000
```

---

## Project Structure

```
nodejsapp/
├── app.js                # Node.js Application Entry Point
├── package.json           # Node.js Project Dependencies
├── package-lock.json      # Dependency Lock File
├── Jenkinsfile            # CI/CD Pipeline Definition
└── Dockerfile             # Docker Build Configuration
```

---

## Troubleshooting

1. **Node.js or npm Not Found:**
   - Ensure Node.js and npm are installed by running `node -v` and `npm -v`.

2. **Docker Build Fails:**
   - Ensure the Docker daemon is running with `sudo systemctl start docker`.

3. **Pipeline Errors:**
   - Review the Jenkins console output for detailed error messages.

---

## Conclusion

By following this guide, you have successfully set up a complete CI/CD pipeline for a Node.js application using Jenkins and Docker.
