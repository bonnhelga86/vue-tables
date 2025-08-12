export const getIncomes = () => {
  return {
    data() {
      return {
        incomes: [],
        error: null
      }
    },
    async mounted() {
      try {
        const response = await fetch('https:///109.73.206.144:6969/api/incomes?dateFrom=2025-08-01&dateTo=2025-08-11&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie');
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        this.incomes = await response.json();
      } catch (e) {
        this.error = e.message;
      }
    }
  }
}