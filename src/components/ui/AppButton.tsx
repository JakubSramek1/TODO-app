import {Button, ButtonProps, SystemStyleObject, useRecipe} from '@chakra-ui/react';
import {buttonRecipe} from '../../theme';

const AppButton = ({css: cssProp, ...buttonProps}: ButtonProps) => {
  const getRecipe = useRecipe({recipe: buttonRecipe});
  const recipeStyles = getRecipe() as SystemStyleObject;

  const combinedStyles = cssProp
    ? Array.isArray(cssProp)
      ? [recipeStyles, ...cssProp]
      : [recipeStyles, cssProp]
    : recipeStyles;

  return <Button css={combinedStyles} {...buttonProps} />;
};

export default AppButton;
