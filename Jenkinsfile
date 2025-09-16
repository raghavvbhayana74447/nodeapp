pipeline {
    agent any

    tools {
        nodejs "node20"
    }

    environment {
        RESOURCE_GROUP = "RnD-RaghavRG"
        APP_NAME = "myWebApp"   // existing webapp you created from UI
    }

    stages {
        stage('Login to Azure CLI') {
            steps {
                withCredentials([
                string(credentialsId: 'AZURE_CLIENT_ID', variable: 'CLIENT_ID'),
                string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'CLIENT_SECRET'),
                string(credentialsId: 'AZURE_TENANT_ID', variable: 'TENANT_ID'),
                string(credentialsId: 'AZURE_SUBSCRIPTION_ID', variable: 'SUBSCRIPTION_ID')
            ]) {
                sh '''
                    az login --service-principal -u $CLIENT_ID -p $CLIENT_SECRET --tenant $TENANT_ID
                    az account set --subscription $SUBSCRIPTION_ID
                    az account show
                '''
}

            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    node -v
                    npm -v
                    npm install
                '''
            }
        }

        stage('Package ZIP') {
            steps {
                sh '''
                    mkdir -p output
                    zip -r output/app.zip * .[^.]* -x output/*
                '''
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([
                    string(credentialsId: 'AZURE_SUBSCRIPTION_ID', variable: 'SUBSCRIPTION_ID')
                ]) {
                    sh '''
                        az webapp deployment source config-zip \
                            --resource-group $RESOURCE_GROUP \
                            --name $APP_NAME \
                            --src output/app.zip \
                            --subscription $SUBSCRIPTION_ID
                    '''
                }
            }
        }
    }
}
