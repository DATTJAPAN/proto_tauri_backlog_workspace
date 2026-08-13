# MAKE SURE TO INIT YOUR AI  WITH THIS MARKDOWN
## Purpose

These guidelines define how AI should generate code, documentation, and technical recommendations across all company projects.

The objective is to ensure AI-generated output is:

* Consistent
* Readable
* Maintainable
* Testable
* Predictable

AI should assist engineers—not replace engineering judgment.

---

# General Guidelines

## 1. Respect the Existing Codebase

Always follow the project's existing architecture, coding conventions, design patterns, and naming conventions.

Do not introduce new abstractions, frameworks, or coding styles unless explicitly requested or there is a clear architectural benefit.

Consistency across the codebase is more valuable than individual preference.

---

# Architecture & Design Patterns

## Apply Established Design Patterns

When appropriate, it is **encouraged** to apply well-established software architecture principles and design patterns that improve maintainability, scalability, readability, and testability.

Examples include, but are not limited to:

### Architectural Patterns

* Domain-Driven Design (DDD)
* Layered Architecture
* Onion Architecture
* Clean Architecture
* Hexagonal Architecture (Ports & Adapters)

### Design Principles

* SOLID Principles
* DRY (Don't Repeat Yourself)
* KISS (Keep It Simple, Stupid)
* YAGNI (You Aren't Gonna Need It)

### Common Design Patterns

* Repository Pattern
* Factory Pattern
* Strategy Pattern
* Command Pattern
* Builder Pattern
* Adapter Pattern
* Observer Pattern
* Dependency Injection

Patterns should only be introduced when they provide a clear benefit.

Do not introduce additional abstraction simply because a design pattern exists.

---

## Follow the Existing Architecture First

Before introducing a new pattern or abstraction:

* Understand the existing architecture.
* Follow existing project conventions.
* Extend existing patterns before creating new ones.
* Keep implementations consistent with the surrounding code.

Consistency is generally more valuable than introducing a "better" architecture in only one part of the system.

---

## Prefer Evolution Over Rewriting

Improve the architecture incrementally.

Do not rewrite existing modules solely to introduce a preferred design pattern unless explicitly requested.

New implementations should naturally evolve the architecture instead of replacing it.

---

## Avoid Over-Engineering

Do not introduce additional layers, interfaces, services, or abstractions unless they solve a real problem.

Favor the simplest solution that satisfies the current requirements while remaining easy to extend.

---

## Think About Future Maintenance

When generating code, always consider:

* Is it easy to understand?
* Is it easy to test?
* Is it easy to extend?
* Does it align with the current architecture?
* Will another engineer immediately understand it?
* Is the added complexity justified?

Architecture should reduce complexity—not create it.

---

## Architecture Is a Tool, Not a Goal

The goal is not to maximize the number of design patterns used.

The goal is to produce software that is:

* Correct
* Readable
* Maintainable
* Testable
* Consistent
* Easy to extend

---

## 2. Write Explicit Code

Favor code that is:

* Easy to understand
* Easy to debug
* Easy to review
* Easy to maintain

Avoid overly clever implementations that sacrifice readability.

---

## 3. Avoid Magic Behavior

Do not introduce:

* Hidden side effects
* Implicit behavior
* Automatic mutations
* Unexpected execution flow

Every important behavior should be explicit.

---

## 4. Prefer Readability Over Brevity

Do not reduce readability simply to decrease the number of lines.

Readable code is preferred over compact code.

---

## 5. Limit Nested Ternary Operators

Nested ternary operators should never exceed one level.

If the condition becomes difficult to read, prefer `if` / `else`.

---

## 6. Document Complex Logic

Add DocBlocks when implementing:

* Complex algorithms
* Business rules
* Public APIs
* Non-obvious implementation details

Documentation should explain **why**, not simply **what**.

---

## 7. Comment Important Logic

Add inline comments when:

* Business rules are involved.
* Variables represent important concepts.
* Calculations are difficult to understand.
* Architectural decisions require context.

Avoid comments that merely repeat what the code already states.

---

## 8. Preserve Meaningful Comments

Do not remove existing comments unless:

* They are outdated.
* They are incorrect.
* The code has become sufficiently self-explanatory.

Business-context comments should always be preserved.

---

## 9. Avoid Unnecessary Helper Functions

Do not extract helper methods simply to reduce the number of lines.

Create helper methods only when they:

* Improve readability.
* Encapsulate a meaningful responsibility.
* Represent reusable behavior.

Avoid creating helper functions for niche or one-time use cases.

---

## 10. Prefer Composition Over Inheritance

Favor composition whenever possible.

Composition generally results in:

* Lower coupling
* Better maintainability
* Easier testing
* Greater flexibility

Use inheritance only when there is a clear **"is-a"** relationship.

---

## 11. Avoid Premature Optimization

Do not optimize code before it is necessary.

Prioritize:

1. Correctness
2. Readability
3. Maintainability

Only optimize after:

* The implementation is complete.
* Performance has been measured.
* A genuine bottleneck has been identified.

Avoid introducing complexity for theoretical performance gains.

> Make it work. Make it clean. Then make it fast—only if necessary.

---

## 12. Do Not Mix Refactoring with Feature Development

Unless explicitly requested:

* Do not refactor unrelated code while implementing new behavior.
* Keep feature implementation and refactoring as separate changes.

This minimizes regressions and simplifies code reviews.

---

## 13. Preserve Existing Business Logic

Do not assume existing behavior is incorrect simply because it appears unusual.

If business logic seems inconsistent:

* Preserve the existing behavior.
* Ask for clarification when necessary.
* Never rewrite business rules based on assumptions.

---

# Naming Conventions

Maintain consistent naming conventions throughout the project.

---

## Constants

Constants should use **UPPER_SNAKE_CASE**.

```ts
const THRESHOLD_MINUTE = 60;
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;
```

Avoid magic numbers or hardcoded business values.

---

## Private Variables

Private instance variables should use the `_camelCase` convention.

```ts
private _thresholdMinute = 60;
private _selectedUser;
private _cache;
```

---

## Private Methods

Private methods should be prefixed with `__`.

```ts
private __calculateTotal() {}
private __renderToolbar() {}
private __initializeCanvas() {}
```

---

## Public Methods

Public methods should use standard `camelCase`.

```ts
calculateTotal() {}
render() {}
initialize() {}
```

---

## Variables

Use descriptive camelCase variable names.

Good:

```ts
remainingLeaveCount
selectedEmployee
approvedRequests
```

Avoid:

```ts
tmp
cnt
obj
val
data1
```

Avoid abbreviations unless they are universally understood.

---

## Boolean Variables

Boolean variables should clearly express a true/false state.

Use prefixes such as:

* is
* has
* can
* should
* was

Examples:

```ts
isEnabled
hasPermission
canEdit
shouldRetry
wasProcessed
```

---

## Method Names

Method names should clearly describe an action.

Prefer:

```ts
calculateTotal()
findUserById()
validateRequest()
sendNotification()
buildQuery()
```

Avoid generic names such as:

```ts
process()
handle()
execute()
run()
```

unless the surrounding context already makes the purpose obvious.

---

## Class Names

Classes should use **PascalCase**.

Each class should have a single responsibility.

Examples:

```ts
AttendanceService
HolidayValidator
InvoiceCalculator
UserRepository
```

---

## File Names

File names should match the primary class, component, or module they contain.

Examples:

```text
AttendanceService.cs
HolidayValidator.ts
CanvasToolbar.tsx
UserRepository.php
```

---

# Frontend Guidelines

## Follow the Design System

Use:

* Tailwind CSS
* shadcn/ui

as the primary reference when generating UI.

Avoid introducing custom UI patterns unless required.

---

## Keep Components Focused

Each component should have a single responsibility.

Avoid large components managing unrelated concerns.

---

## Prefer Component Composition

Favor composition over large configurable components.

Extract reusable components only when genuine reuse exists.

---

## Keep Component APIs Explicit

Prefer explicit props over hidden behavior.

Components should be understandable without reading their implementation.

---

# Backend Guidelines

## Prioritize Readability

Business logic should be immediately understandable.

---

## Follow Layer Responsibilities

Respect the project's architectural boundaries.

Do not mix business logic, infrastructure, persistence, and presentation concerns.

---

## Single Responsibility

Methods should perform one responsibility.

Break large methods apart only when doing so improves readability.

---

## Use Descriptive Naming

Variables, methods, and classes should clearly communicate their purpose.

Avoid unnecessary abbreviations.

---

## Avoid Hidden Side Effects

Methods should perform only the behavior implied by their name.

Unexpected mutations should be avoided.

---

## Prefer Dependency Injection

Prefer dependency injection over:

* Static helpers
* Global state
* Singleton access

This improves maintainability and testability.

---

## Preserve Business Rules

Business rules should remain centralized and explicit.

Avoid scattering important logic across unrelated classes.

---

# Unit Testing Guidelines

## Write Tests for Significant Code

Every meaningful implementation should include unit tests.

Examples include:

* Service classes
* Domain classes
* Business logic
* Large functions
* Complex utilities

Simple DTOs, entities, or models generally do not require dedicated tests unless they contain business logic.

---

## Assume Tests Will Be Requested

Whenever AI generates a significant function or class, assume the next prompt will request unit tests.

Generate production code that naturally supports testing.

---

## Generate Comprehensive Test Cases

Include:

* Happy paths
* Edge cases
* Invalid inputs
* Exception handling
* Boundary conditions
* Regression tests

Tests should validate behavior—not simply increase code coverage.

---

## Write Testable Code

Prefer:

* Small methods
* Explicit dependencies
* Dependency Injection
* Deterministic behavior
* Pure functions where appropriate

Avoid implementations that require excessive mocking or complicated test setup.

---

# Documentation Guidelines

Documentation should:

* Explain intent rather than implementation.
* Stay synchronized with the codebase.
* Follow project documentation standards.
* Avoid AI hallucinations or fabricated information.

Always verify AI-generated documentation before publishing.

---

# General AI Behavior

When generating code:

* Follow the existing project architecture.
* Follow existing project conventions.
* Respect naming conventions.
* Prefer explicit implementations.
* Generate code that is review-friendly.
* Preserve existing behavior unless instructed otherwise.
* Ask for clarification instead of making assumptions.
* Avoid unnecessary abstractions.
* Avoid introducing frameworks or patterns without justification.
* Think about long-term maintainability.

---

# Decision Priority

When making implementation decisions, prioritize:

1. Correctness
2. Readability
3. Maintainability
4. Consistency with the existing codebase
5. Testability
6. Simplicity
7. Performance (only when justified)

---

# Guiding Principle

Generate code that every engineer on the team can confidently:

* Read
* Review
* Understand
* Test
* Debug
* Maintain
* Extend

without needing AI to explain how the implementation works.

> **AI should help create better engineers—not engineers who depend on AI.**
