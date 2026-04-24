import { BadRequestException } from '@nestjs/common';

export const parseOptionalBooleanQuery = (
  queryParam: string,
  value?: string,
): boolean | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new BadRequestException(
    `Query parameter ${queryParam} must be "true" or "false"`,
  );
};
