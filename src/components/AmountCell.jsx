import { getAmountDisplay } from '../utils/money.js';

/**
 * Composant pour afficher un montant avec la bonne couleur et le bon signe
 */
const AmountCell = ({ amount, type }) => {
  const { colorClasses, formattedAmount } = getAmountDisplay(amount, type);
  
  return (
    <span className={`font-semibold ${colorClasses}`}>
      {formattedAmount}
    </span>
  );
};

export default AmountCell;