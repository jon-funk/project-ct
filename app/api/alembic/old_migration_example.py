# This is an example migration
# originally placed in versions/

# """Initial Schema

# Revision ID: 5720c3a750e7
# Revises: None
# Create Date: 2022-01-13 16:35:50.072297

# """

# # revision identifiers, used by Alembic.
# revision = '5720c3a750e7'
# down_revision = None

# from alembic import op
# import sqlalchemy as sa

# from alembic import context


# def upgrade():
#     schema_upgrades()
#     if context.get_x_argument(as_dictionary=True).get("data", None):
#         data_upgrades()


# def downgrade():
#     if context.get_x_argument(as_dictionary=True).get("data", None):
#         data_downgrades()
#     schema_downgrades()


# def schema_upgrades():
#     """schema upgrade migrations go here."""
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.create_table(
#         'example', sa.Column('created_timestamp', sa.DateTime(),
#                              nullable=True),
#         sa.Column('last_updated_timestamp', sa.DateTime(), nullable=True),
#         sa.Column('id', sa.Integer(), nullable=False),
#         sa.Column('name', sa.String(), nullable=True),
#         sa.PrimaryKeyConstraint('id'))
#     op.create_index(op.f('ix_example_id'), 'example', ['id'], unique=False)
#     op.create_index(op.f('ix_example_name'), 'example', ['name'], unique=True)
#     # ### end Alembic commands ###


# def schema_downgrades():
#     """schema downgrade migrations go here."""
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.drop_index(op.f('ix_example_name'), table_name='example')
#     op.drop_index(op.f('ix_example_id'), table_name='example')
#     op.drop_table('example')
#     # ### end Alembic commands ###


# def data_upgrades():
#     """Add any optional data upgrade migrations here!"""
#     pass


# def data_downgrades():
#     """Add any optional data downgrade migrations here!"""
#     pass