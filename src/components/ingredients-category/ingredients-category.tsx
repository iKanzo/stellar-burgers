import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { selectConstructor } from '../../services/slices/constructorSlice';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, onIngredientClick }, ref) => {
  const burgerConstructor = useSelector(selectConstructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = burgerConstructor;

    const counters: { [key: string]: number } = {};

    if (constructorIngredients && constructorIngredients.length > 0) {
      constructorIngredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }

    if (bun) counters[bun._id] = 2;

    return counters;
  }, [burgerConstructor]);

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      onIngredientClick={onIngredientClick}
    />
  );
});
