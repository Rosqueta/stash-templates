---
title_es: Escribir tests unitarios
title_en: Write unit tests
variables_es: [lenguaje, framework_de_tests, funcion_o_modulo]
variables_en: [language, test_framework, function_or_module]
tags: []
---
Escribe tests unitarios completos para el siguiente código de {{lenguaje}} usando {{framework_de_tests}}.

Código a testear:
{{funcion_o_modulo}}

Incluye:
- Tests del camino feliz cubriendo el comportamiento esperado normal
- Casos límite (entrada vacía, valores en los límites, entrada grande)
- Casos de error (entrada inválida, excepciones esperadas)
- Cualquier comportamiento no obvio que deba documentarse mediante tests

Los tests deben ser claros, aislados y fáciles de mantener.
---EN---
Write comprehensive unit tests for the following {{language}} code using {{test_framework}}.

Code to test:
{{function_or_module}}

Include:
- Happy path tests covering normal expected behavior
- Edge cases (empty input, boundary values, large input)
- Error cases (invalid input, expected exceptions)
- Any non-obvious behavior that should be documented through tests

Tests should be clear, isolated, and easy to maintain.
