import { Env } from '@haechi-labs/face-types';

export const API_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS23ncDS7x8nmTuK1FFN0EfYo0vo6xhTBMBNWVbQsufv60X8hv3-TbAQ3JIyMEhLo-c-31oYrvrQ0G2e9j8yvJYEUnLuE-PaABo0y3V5m9g_qdTB5p9eEfqZlDrcUl1zUr4W7rJwFwkTlAFSKOqVCPnm8ozmcMyyrEHgl2AbehrQIDAQAB';

export const resolveApiKey = (env: Env | null) => {
  switch (env) {
    case Env.StageMainnet:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAzwMteOlPhbHkRMA1dJo0D3yCtKXWR9mLmTZmNwnEw6O9nVxb88G8wqMZSRapuhKxT-PRDf4yuDLJgSeHHB8k6l6jlhTjDmA9y6JB052lrneOf0z4NmbQJ3BsiyAHX7vrPa-wDMd6lcmGNKW-BowwbBDLi6yy59qlPBex8Bba_wIDAQAB';
    case Env.ProdMainnet:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5jEuZU9r-SBfRHSx70ynSh-3Ew7SapJTbLqEUiA0ZJ2w3OUWeJPz8aYHX0Py78kNaoCCQa8JdAXsyyrrMLE8gmIqoFrjzFYmcUZ1sc5uP7ue8iDhZURYlauFC3npRiMvL__Q_CeIQq9MrFqvCLOZcU-WW-_sjRbslLGMmQWPjcQIDAQAB';
    case Env.Dev:
    case Env.Local:
    case Env.StageTest:
    case Env.ProdTest:
      return 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS23ncDS7x8nmTuK1FFN0EfYo0vo6xhTBMBNWVbQsufv60X8hv3-TbAQ3JIyMEhLo-c-31oYrvrQ0G2e9j8yvJYEUnLuE-PaABo0y3V5m9g_qdTB5p9eEfqZlDrcUl1zUr4W7rJwFwkTlAFSKOqVCPnm8ozmcMyyrEHgl2AbehrQIDAQAB';
    default:
      throw new Error('unsupported network error');
  }
};
