import { AccountService } from '../service/Account.service';

export function appInitializer(accountService: AccountService) {
    return () => new Promise(resolve => {
            accountService.refreshToken()
            .then()
            .finally(resolve);
    });
}