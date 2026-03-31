## Design Context

### Users
- Primary users include retail investors, short-term traders, agent-account onboarding users, and internal operations staff.
- The product is used in fast decision-making contexts around market observation, trade execution, asset review, and account handling.
- Interfaces should support quick scanning, low hesitation, and reliable action-taking on mobile-first screens.

### Brand Personality
- Core personality: trustworthy, professional, restrained.
- In trading-critical areas, the interface can lean more aggressive and faster-paced, but only within a controlled, credible financial tone.
- The product should feel dependable first, energetic second. It should never feel playful, speculative, or gimmicky.

### Aesthetic Direction
- Visual direction: Japanese financial app.
- Theme is fixed and should preserve the current primary palette, especially the existing blue / white foundation with yellow emphasis.
- Layouts should feel compact, clean, data-first, and operationally clear, with strong rhythm and sharp action hierarchy.
- Avoid redesign directions that discard the current theme colors or introduce unrelated aesthetics.
- CSS implementation should continue to work well with TailwindCSS rather than replacing it with a separate styling ideology.

### Design Principles
1. Preserve trust through clarity. Financial information, balances, and trade actions must read clearly at a glance.
2. Use restraint as the default. Keep surfaces, spacing, and decoration controlled; let emphasis come from hierarchy, not noise.
3. Increase intensity only where action matters. Price movement, buy/sell actions, and key portfolio states may carry more urgency and speed.
4. Design mobile-first for dense information. Components must handle tight widths without overflow, clipped actions, or ambiguous grouping.
5. Stay consistent with the current system. Keep the established theme colors, existing interaction language, and TailwindCSS-friendly structure.
