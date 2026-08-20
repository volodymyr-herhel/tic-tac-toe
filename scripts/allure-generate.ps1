. "$PSScriptRoot/allure-common.ps1"
Ensure-JavaHome
allure generate ./allure-results --clean -o ./allure-report
