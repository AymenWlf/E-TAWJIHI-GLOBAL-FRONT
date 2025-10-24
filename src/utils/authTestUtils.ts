// Utilitaires pour tester le système d'authentification
export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const testUsers: TestUser[] = [
  {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  },
  {
    email: 'admin@e-tawjihi.ma',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'student@example.com',
    password: 'student123',
    firstName: 'Student',
    lastName: 'User'
  }
];

export const testScenarios = {
  validLogin: {
    description: 'Valid login with correct credentials',
    email: 'test@example.com',
    password: 'password123',
    expectedResult: 'success'
  },
  invalidLogin: {
    description: 'Invalid login with wrong password',
    email: 'test@example.com',
    password: 'wrongpassword',
    expectedResult: 'error'
  },
  invalidEmail: {
    description: 'Invalid login with wrong email',
    email: 'wrong@example.com',
    password: 'password123',
    expectedResult: 'error'
  },
  validRegistration: {
    description: 'Valid registration with new user',
    email: 'newuser@example.com',
    password: 'newpassword123',
    firstName: 'New',
    lastName: 'User',
    expectedResult: 'success'
  },
  duplicateRegistration: {
    description: 'Registration with existing email',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    expectedResult: 'error'
  },
  forgotPassword: {
    description: 'Forgot password with valid email',
    email: 'test@example.com',
    expectedResult: 'success'
  },
  forgotPasswordInvalid: {
    description: 'Forgot password with invalid email',
    email: 'nonexistent@example.com',
    expectedResult: 'error'
  }
};

export const apiEndpoints = {
  base: 'http://localhost:8000/api',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    me: '/auth/me',
    refresh: '/auth/refresh',
    changePassword: '/auth/change-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification'
  }
};

export const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [] as Array<{
    test: string;
    status: 'passed' | 'failed';
    message: string;
    duration: number;
  }>
};

export const runAuthTest = async (testName: string, testFunction: () => Promise<any>) => {
  const startTime = Date.now();
  try {
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    testResults.passed++;
    testResults.total++;
    testResults.details.push({
      test: testName,
      status: 'passed',
      message: 'Test passed successfully',
      duration
    });
    
    console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    return result;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    testResults.failed++;
    testResults.total++;
    testResults.details.push({
      test: testName,
      status: 'failed',
      message: error.message || 'Test failed',
      duration
    });
    
    console.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message}`);
    throw error;
  }
};

export const printTestSummary = () => {
  console.log('\n📊 Test Summary:');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter(detail => detail.status === 'failed')
      .forEach(detail => {
        console.log(`  - ${detail.test}: ${detail.message}`);
      });
  }
  
  console.log('\n✅ Passed Tests:');
  testResults.details
    .filter(detail => detail.status === 'passed')
    .forEach(detail => {
      console.log(`  - ${detail.test} (${detail.duration}ms)`);
    });
};

export const resetTestResults = () => {
  testResults.passed = 0;
  testResults.failed = 0;
  testResults.total = 0;
  testResults.details = [];
};
