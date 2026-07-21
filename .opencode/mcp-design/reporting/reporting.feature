Feature: reporting

  Scenario: Successful ReportRepositoryPort call
    Given the reporting system is initialized
    Given valid credentials are provided
    When a ReportRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for ReportRepositoryPort
    Given the reporting system is initialized
    When an invalid ReportRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: ReportRepositoryPort without authorization
    Given the reporting system is initialized
    When a ReportRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful ReportingUseCase call
    Given the reporting system is initialized
    Given valid credentials are provided
    When a ReportingUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for ReportingUseCase
    Given the reporting system is initialized
    When an invalid ReportingUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: ReportingUseCase without authorization
    Given the reporting system is initialized
    When a ReportingUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
