pipeline{
    agent any

    environment{
        subscriptionId = credentials('AZURE_SUBSCRIPTION_ID')
        tenantId = credentials('AZURE_TENANT_ID')
        AZURE_CREDENTIALS_ID  = 'SubscriptionPlan'
        subscription_id = 'AzureSubscriptionId'

    }
    tools {
        nodejs "node20"
    }


    stages
    {
        stage('logging in azure cli'){
            steps
            {
                withCredentials([usernamePassword(credentialsId: "${SubscriptionPlan}",
                usernameVariable: "${clientId}",
                passwordVariable: "${clientSecret}")])
                string(credentialsI: 'AzureSubscriptionId', variable:'subscription_id')
                {
                sh '''
                az login -u $usernameVariable -p $passwordVariable
                az account set --subscription $subscription_id
                az account show
                '''
                }
            }
        
        }
        stage('creating az webapp plan'){
            steps
            {
            sh '''
            az appservice plan create --name my-app-plan --resource-group RnD-RaghavRG --sku FREE
            '''
            }
        }
        stage('creating webapp'){
            steps{
            sh '''
            az webapp create --name myWebApp --resource-group RnD-RaghavRG --plan my-app-plan
            '''
            }
        }    
        stage('Install Node'){
        steps {
            sh 'node -v'
            sh 'npm -v'
        }
        }        
        stage('Install Dependencies') {
        steps {
            sh 'npm install'
        }
        }
        stage('creating a zip file'){
             steps {
                sh '''
                    mkdir -p output
                    zip -r output/app.zip * .[^.]* -x output/*

                '''
            }
        }
        stage('Deploy to Azure') {
            steps {
                withCredentials([string(credentialsId: 'azure-publish-profile', variable: 'PUBLISH_PROFILE')]) {
                    sh '''
                        echo "$PUBLISH_PROFILE" > publishProfile.xml
                        az webapp deployment source config-zip \
                          --resource-group RnD-RaghavRG\
                          --name myWebApp \
                          --src output/app.zip \
                          --subscription $subscription_id \
                          --slot production \
                          --debug \
                          --query publishingProfile \
                          --output none
                    '''
                }
            }
        }
    }
}