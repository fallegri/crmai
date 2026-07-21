Feature: activities

  Scenario: Successful ActivityRepositoryPort call
    Given the activities system is initialized
    Given valid credentials are provided
    When a ActivityRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for ActivityRepositoryPort
    Given the activities system is initialized
    When an invalid ActivityRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: ActivityRepositoryPort without authorization
    Given the activities system is initialized
    When a ActivityRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful ActivityUseCase call
    Given the activities system is initialized
    Given valid credentials are provided
    When a ActivityUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for ActivityUseCase
    Given the activities system is initialized
    When an invalid ActivityUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: ActivityUseCase without authorization
    Given the activities system is initialized
    When a ActivityUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
