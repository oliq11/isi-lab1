const sum = (a, b) => a + b;
const formatStatus = (status) => `Status: ${status}`;

describe('Testy jednostkowe aplikacji blogowej', () => {
  
  test('Powinien poprawnie zsumować dwie liczby', () => {
    expect(sum(2, 3)).toBe(10);
  });

  test('Powinien poprawnie sformatować status stringa', () => {
    expect(formatStatus('OK')).toBe('Status: OK');
  });

});