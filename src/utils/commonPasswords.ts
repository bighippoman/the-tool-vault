
// Top 1000 most common passwords for local checking
export const commonPasswords = new Set([
  'password', '123456', '123456789', 'guest', 'qwerty', '12345678', '111111', '12345',
  'col123456', '123123', '1234567', '1234', '1234567890', '000000', '555555', '666666',
  '123321', '654321', '7777777', '123', 'D1lakiss', '777777', 'abc123', '1234560',
  '1234565', '0123456789', '987654321', '1234qwer', 'admin', 'qwertyuiop', '654321',
  'Pass@word1', 'password1', '1q2w3e4r', '7777777', '1q2w3e', 'qwertyui', '123456a',
  'Password1', 'password123', '123456789a', 'q1w2e3r4', 'qwer1234', '123456789',
  'sec4ever', 'password2', 'gfhjkm', 'qazwsxedc', '159357', 'p@ssw0rd', 'pokemon',
  'qwerty123', 'Gbt3fC79ZmMEFUFJ', 'asdfghjkl', '147258369', 'qwertyuiop', 'qwerty12',
  'qwerty1', '192837465', 'soccer', 'a1b2c3d4', 'FQRG7CS493', 'hello', 'letmein',
  'football', 'monkey', 'charlie', 'aa123456', 'donald', 'password12', 'qwer123',
  'dragon', 'master', '696969', 'mustang', 'michael', '000000', 'superman', '1qaz2wsx',
  'shadow', 'baseball', 'welcome', '123qwe', 'freedom', 'whatever', 'nicole', 'jordan',
  'cameron', 'secret', 'summer', 'princess', 'amanda', 'jesus', 'jessica', 'lovely',
  'admin', 'welcome', 'monkey', 'access', 'flower', 'computer', 'qwerty', 'hello',
  'gydw', 'test', 'guest', 'info', 'administrator', 'root', 'demo', 'user', 'temp',
  '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '0000',
  'abcd', 'abcde', 'abcdef', 'abcdefg', 'abcdefgh', 'qwer', 'qwert', 'qwerty',
  'asdf', 'asdfg', 'asdfgh', 'zxcv', 'zxcvb', 'zxcvbn', 'zxcvbnm',
  'iloveyou', 'trustno1', 'sunshine', 'ashley', 'bailey', 'passw0rd', 'shadow',
  'welcome', 'login', 'admin', 'test', 'guest', 'info', 'adm', 'mysql', 'qwertyuiop',
  'administrator', 'root', 'toor', 'pass', 'test', 'guest', 'info', 'adm', 'mysql',
  'user', 'administrator', 'oracle', 'ftp', 'pi', 'puppet', 'ansible', 'ec2-user',
  'vagrant', 'azureuser', 'demo', 'examples', 'public', 'sample', 'sharing', 'ftp',
  'apache', 'nginx', 'www', 'web', 'mail', 'email', 'data', 'test', 'demo', 'user',
  '123', '1234', '12345', '123456', '1234567', '12345678', '123456789', '1234567890',
  'password', 'Password', 'PASSWORD', 'pass', 'Pass', 'PASS', 'passwd', 'pwd',
  'secret', 'Secret', 'SECRET', 'private', 'Private', 'PRIVATE', 'confidential'
]);

export const checkCommonPassword = (password: string): boolean => {
  return commonPasswords.has(password.toLowerCase()) || 
         commonPasswords.has(password) ||
         commonPasswords.has(password.toUpperCase());
};
