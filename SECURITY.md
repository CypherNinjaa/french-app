# Security Guidelines

## 🔒 API Key Management

### Environment Variables

- All sensitive data (API keys, database URLs) should be stored in environment variables
- Use `.env` files for local development (already in `.gitignore`)
- Never commit actual API keys to version control

### Current Environment Variables Used:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_GROQ_API_KEY` - Your Groq API key for AI features

### Setup Process:

1. Copy `.env.example` to `.env`
2. Fill in your actual API keys
3. Verify `.env` is in `.gitignore`

## 🚨 If You Accidentally Commit Secrets

1. **Immediately revoke/regenerate the exposed API keys**
2. **Remove secrets from git history**:

   ```bash
   # Remove file from git history (if needed)
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch filename' \
   --prune-empty --tag-name-filter cat -- --all

   # Push the cleaned history
   git push origin --force --all
   ```

3. **Update the keys in your environment**

## 🔐 Best Practices

- Use environment variables for all sensitive data
- Keep `.env` files in `.gitignore`
- Use `.env.example` to document required environment variables
- Regular rotation of API keys
- Monitor for accidental exposure using tools like GitHub secret scanning

## ⚠️ Current Status

**Action Required**: A Groq API key was previously exposed in documentation files and has been removed. Please:

1. Regenerate your Groq API key at https://console.groq.com/keys
2. Update your local `.env` file with the new key
3. Ensure the new key is never committed to version control
