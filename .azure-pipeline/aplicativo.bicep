param webAppName string = uniqueString(resourceGroup().id)
param sku string = 'F1' 
param location string = resourceGroup().location

var appServicePlanName = toLower('AppServicePlan-${webAppName}')
resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
    name: sku
  }
  kind: 'app'
}
resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webAppName
  kind: 'app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|6.0'
    }
  }
}
