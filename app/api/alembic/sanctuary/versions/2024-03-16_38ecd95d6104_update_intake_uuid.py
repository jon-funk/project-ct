"""CHANGEME

Revision ID: 38ecd95d6104
Revises: e7a96dd328c5
Create Date: 2024-03-16 16:04:43.591150

"""

from alembic import op
import sqlalchemy as sa

from alembic import context

# revision identifiers, used by Alembic.
revision = "38ecd95d6104"
down_revision = "e7a96dd328c5"
branch_labels = None
depends_on = None


def upgrade():
    schema_upgrades()
    if context.get_x_argument(as_dictionary=True).get("data", None):
        data_upgrades()


def downgrade():
    if context.get_x_argument(as_dictionary=True).get("data", None):
        data_downgrades()
    schema_downgrades()


def schema_upgrades():
    """schema upgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, "intakes", ["intake_uuid"])
    # ### end Alembic commands ###


def schema_downgrades():
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "intakes", type_="unique")
    # ### end Alembic commands ###


def data_upgrades():
    """Add any optional data upgrade migrations here!"""


def data_downgrades():
    """Add any optional data downgrade migrations here!"""
    pass
