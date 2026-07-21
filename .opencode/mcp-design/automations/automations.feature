Feature: automations

  Scenario: Successful AutomationRepositoryPort call
    Given the automations system is initialized
    Given valid credentials are provided
    When a AutomationRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for AutomationRepositoryPort
    Given the automations system is initialized
    When an invalid AutomationRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: AutomationRepositoryPort without authorization
    Given the automations system is initialized
    When a AutomationRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful AutomationUseCase call
    Given the automations system is initialized
    Given valid credentials are provided
    When a AutomationUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for AutomationUseCase
    Given the automations system is initialized
    When an invalid AutomationUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: AutomationUseCase without authorization
    Given the automations system is initialized
    When a AutomationUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
