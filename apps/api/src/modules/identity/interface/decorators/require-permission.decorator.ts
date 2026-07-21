import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSIONS_KEY = 'require_permissions';
export const RequirePermission = (module: string, action: string) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, [{ module, action }]);
