export class CreateDeviceDto {
  device_id!: string;
  device_public_key!: string;
  created_at!: number;
  account_id!: string;
  device_name!: string;
  last_seen!: number;
  revoked_at?: number;
}
