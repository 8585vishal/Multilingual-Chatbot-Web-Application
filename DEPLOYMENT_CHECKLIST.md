# Production Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured in hosting platform
- [ ] Supabase URL and anon key are production values (not localhost)
- [ ] OpenAI API key is valid and has billing enabled
- [ ] Translation API configured (Google or LibreTranslate)
- [ ] All API keys are kept secret and not committed to git

### Database
- [ ] All migrations applied successfully to production database
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies tested and working
- [ ] Default app settings inserted
- [ ] Default canned responses inserted
- [ ] Database backups configured in Supabase

### Security
- [ ] Authentication working correctly
- [ ] Users can only access their own data
- [ ] No sensitive data exposed in client-side code
- [ ] CORS configured correctly
- [ ] Rate limiting considered (via Supabase or hosting platform)
- [ ] SQL injection protection verified (parameterized queries used)
- [ ] XSS protection enabled

### Testing
- [ ] Sign up flow tested
- [ ] Sign in flow tested
- [ ] Password reset tested (if implemented)
- [ ] All 6 languages tested with sample conversations
- [ ] Language detection working accurately
- [ ] Language switching working
- [ ] Chat history persists correctly
- [ ] Voice input tested (on HTTPS)
- [ ] Voice output tested (if enabled)
- [ ] Dark mode toggle working
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)

### Performance
- [ ] Build optimized (`npm run build` successful)
- [ ] Bundle size acceptable (< 1MB recommended)
- [ ] Images optimized (if any added)
- [ ] Lazy loading implemented where appropriate
- [ ] API calls debounced/throttled as needed
- [ ] Database queries optimized (indexes added)

### API Integration
- [ ] OpenAI API calls working
- [ ] Proper error handling for API failures
- [ ] Fallback responses configured
- [ ] Translation API working
- [ ] API usage limits understood
- [ ] Cost monitoring set up

### Monitoring
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (optional)
- [ ] Supabase dashboard monitoring enabled
- [ ] Usage alerts set up for API limits
- [ ] Database size monitoring enabled

### Documentation
- [ ] README.md updated with production URLs
- [ ] Environment variables documented
- [ ] Deployment instructions clear
- [ ] User guide available
- [ ] Admin guide available
- [ ] API documentation complete

### Legal & Compliance
- [ ] Privacy policy created and linked
- [ ] Terms of service created and linked
- [ ] Cookie consent implemented (if required)
- [ ] GDPR compliance verified (if applicable)
- [ ] Data retention policy documented
- [ ] User data deletion process implemented

## Deployment Steps

### Option 1: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to project settings
   - Add all `VITE_*` variables
   - Redeploy if needed

5. Verify deployment:
   - [ ] Site loads correctly
   - [ ] Authentication works
   - [ ] Database connection works
   - [ ] All features functional

### Option 2: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy via Netlify CLI:
```bash
netlify deploy --prod --dir=dist
```

Or use Netlify dashboard:
- Drag and drop `dist/` folder
- Add environment variables in Settings > Environment

3. Verify deployment:
   - [ ] Site loads correctly
   - [ ] Authentication works
   - [ ] Database connection works
   - [ ] All features functional

### Option 3: Custom Server Deployment

1. Build the project:
```bash
npm run build
```

2. Upload `dist/` folder to your server

3. Configure your web server (nginx example):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. Set up SSL certificate:
```bash
certbot --nginx -d yourdomain.com
```

5. Verify deployment:
   - [ ] HTTPS working
   - [ ] Site loads correctly
   - [ ] All features functional

## Post-Deployment Checklist

### Immediate Verification
- [ ] Homepage loads without errors
- [ ] Sign up creates new user successfully
- [ ] Sign in works with test account
- [ ] New conversation can be created
- [ ] Messages send and receive correctly
- [ ] Language detection working
- [ ] No console errors in browser
- [ ] Mobile view renders correctly

### User Acceptance Testing
- [ ] Create test account as real user would
- [ ] Test complete user journey
- [ ] Test all 6 languages with real phrases
- [ ] Test voice features (if enabled)
- [ ] Test error scenarios (wrong password, etc.)
- [ ] Verify email notifications (if implemented)

### Performance Verification
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90 (Performance)
- [ ] No memory leaks (test with long session)
- [ ] API response times acceptable

### Security Verification
- [ ] Try to access other users' conversations (should fail)
- [ ] Try SQL injection in chat input (should be safe)
- [ ] Verify HTTPS is enforced
- [ ] Check API keys not exposed in browser
- [ ] Verify secure headers are set

### Monitoring Setup
- [ ] Error tracking receiving events
- [ ] Analytics tracking pageviews
- [ ] Database monitoring active
- [ ] API usage tracking configured
- [ ] Uptime monitoring configured
- [ ] Backup verification scheduled

### Documentation Updates
- [ ] Update README with production URL
- [ ] Document any deployment issues encountered
- [ ] Update configuration docs
- [ ] Create runbook for common issues
- [ ] Document admin procedures

## Rollback Plan

In case of critical issues:

1. **Vercel/Netlify**: Revert to previous deployment via dashboard
2. **Custom Server**: Keep previous build in backup folder
3. **Database**: Ensure recent backup available
4. **Environment**: Keep previous .env values documented

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review user feedback

### Weekly
- [ ] Review analytics
- [ ] Check database size
- [ ] Test backup restoration
- [ ] Review security logs

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize database
- [ ] Audit user permissions
- [ ] Review API costs
- [ ] Test disaster recovery

## Support Contacts

Document your support contacts:

- **Hosting Provider**: [Contact info]
- **Supabase Support**: support@supabase.io
- **OpenAI Support**: support@openai.com
- **Domain Registrar**: [Contact info]
- **SSL Provider**: [Contact info]

## Emergency Procedures

### Site Down
1. Check hosting platform status
2. Check Supabase dashboard
3. Review recent deployments
4. Check error logs
5. Roll back if necessary

### Database Issues
1. Check Supabase dashboard
2. Review recent migrations
3. Check connection limits
4. Verify RLS policies
5. Contact Supabase support if needed

### API Quota Exceeded
1. Check OpenAI usage dashboard
2. Implement rate limiting
3. Add fallback responses
4. Notify users if needed
5. Upgrade plan if necessary

---

## Sign-Off

Before going live, ensure sign-off from:

- [ ] Development Team
- [ ] QA Team
- [ ] Product Owner
- [ ] Security Team
- [ ] Legal Team (if required)

**Deployment Date**: _____________

**Deployed By**: _____________

**Version**: _____________

**Notes**: _____________________________________________

---

Good luck with your deployment! 🚀
