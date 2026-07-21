Feature: campaigns

  Scenario: Successful CampaignRepositoryPort call
    Given the campaigns system is initialized
    Given valid credentials are provided
    When a CampaignRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for CampaignRepositoryPort
    Given the campaigns system is initialized
    When an invalid CampaignRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: CampaignRepositoryPort without authorization
    Given the campaigns system is initialized
    When a CampaignRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful CampaignUseCase call
    Given the campaigns system is initialized
    Given valid credentials are provided
    When a CampaignUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for CampaignUseCase
    Given the campaigns system is initialized
    When an invalid CampaignUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: CampaignUseCase without authorization
    Given the campaigns system is initialized
    When a CampaignUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
