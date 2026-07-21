Feature: agenda

  Scenario: Successful AgendaRepositoryPort call
    Given the agenda system is initialized
    Given valid credentials are provided
    When a AgendaRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for AgendaRepositoryPort
    Given the agenda system is initialized
    When an invalid AgendaRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: AgendaRepositoryPort without authorization
    Given the agenda system is initialized
    When a AgendaRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful AgendaUseCase call
    Given the agenda system is initialized
    Given valid credentials are provided
    When a AgendaUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for AgendaUseCase
    Given the agenda system is initialized
    When an invalid AgendaUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: AgendaUseCase without authorization
    Given the agenda system is initialized
    When a AgendaUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
