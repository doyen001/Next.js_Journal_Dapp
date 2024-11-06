use anchor_lang::prelude::*;
 
// This is your program's public key and it will update automatically when you build the project.
declare_id!("7AGmMcgd1SjoMsCcXAAYwRgB9ihCyM8cZqjsUqriNRQt");
 
#[program]
pub mod journal {
  use super::*;

  pub fn create_journal_entry(
    ctx: Context<CreateEntry>,
    title: String,
    message: String,
  ) -> Result<()> {
    msg!("Journal Entry Created");
    msg!("Title: {}", title);
    msg!("Message: {}", message);

    let journal_entry = &mut ctx.accounts.journal_entry;
    journal_entry.owner = ctx.accounts.owner.key();
    journal_entry.title = title;
    journal_entry.message = message;
    Ok(())
  }
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(50)]
  pub title: String,
    #[max_len(1000)]
  pub message: String,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
  #[account(
      init_if_needed,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      payer = owner,
      space = 8 + JournalEntryState::INIT_SPACE
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}