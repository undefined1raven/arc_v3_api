import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyChallengeDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  accountId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 100)
  deviceId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(86, 86)
  signedChallenge!: string;

  @IsString()
  @IsNotEmpty()
  @Length(43, 43)
  @Matches(/^[A-Za-z0-9_-]+$/)
  plainChallenge!: string;
}
