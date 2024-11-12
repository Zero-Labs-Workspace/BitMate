const PROMPT_TEMPLATES = {
  transactionAnalysis: (txData: any) => `
      You are a crypto DeFi expert, and have years of trading experience analyze these blockchain transactions for rootstock chain:
      ${JSON.stringify(txData, null, 2)}
  
      Provide:
      1. Key patterns and behaviors
      2. Risk assessment
      3. Common interactions
      4. Notable events or anomalies
      5. Summary of DeFi activities
      6. Recommendations for optimization
  
      Format the response in a clear, structured way.
    `,

  portfolioAdvice: (portfolioData: any, marketData: any) => `
      You are a crypto DeFi expert, and have years of trading experience analyze these portfolio and market data for rootstock chain:
      
      Portfolio: ${JSON.stringify(portfolioData, null, 2)}
      Market Data: ${JSON.stringify(marketData, null, 2)}
  
      Provide:
      1. Investment opportunities in the RSK ecosystem
      2. Risk-adjusted recommendations
      3. Portfolio optimization suggestions
      4. Yield farming opportunities
      5. Market trend analysis
      6. Specific project recommendations with rationale
  
      Focus on Rootstack ecosystem projects and DeFi opportunities.
    `,

  chatAssistant: (userContext: any, question: string) => `
      You are a personal DeFi assistant with ton of crypto experience on rootstack chain with access to the following user context:
      ${JSON.stringify(userContext, null, 2)}
  
      The user asks: "${question}"
  
      Provide personalized advice considering:
      - User's transaction history
      - Current portfolio
      - Risk profile
      - Market conditions
      - Rootstock ecosystem opportunities
  
      Be conversational but precise in recommendations.
    `,
};
