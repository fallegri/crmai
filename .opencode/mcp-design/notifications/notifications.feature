Feature: notifications

  Scenario: Successful NotificationRepositoryPort call
    Given the notifications system is initialized
    Given valid credentials are provided
    When a NotificationRepositoryPort request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for NotificationRepositoryPort
    Given the notifications system is initialized
    When an invalid NotificationRepositoryPort request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: NotificationRepositoryPort without authorization
    Given the notifications system is initialized
    When a NotificationRepositoryPort request is made without authorization
    Then the response status is 401
    Then access is denied

  Scenario: Successful NotificationUseCase call
    Given the notifications system is initialized
    Given valid credentials are provided
    When a NotificationUseCase request is made
    Then the response status is 200
    Then the response contains valid data

  Scenario: Invalid input handling for NotificationUseCase
    Given the notifications system is initialized
    When an invalid NotificationUseCase request is made
    Then the response status is 400
    Then an error message is returned

  Scenario: Security: NotificationUseCase without authorization
    Given the notifications system is initialized
    When a NotificationUseCase request is made without authorization
    Then the response status is 401
    Then access is denied
